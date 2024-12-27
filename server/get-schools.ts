import path from 'path';
import fs from 'fs';
import csv from 'csv-parser';

import type { Express } from 'express';

import { config, projectRoot } from './config.js';

let schools:string[] = [];
let countries:string[] = [];

async function loadSchoolsFromCSV() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.resolve(__dirname, 'schools.csv'); 

  return new Promise<void>((resolve, reject) => {
    const schoolList: string[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row:any) => {
        if (row) {
          schoolList.push(row[Object.keys(row)[0]]);
        }
      })
      .on('end', () => {
        schools = schoolList; 
        resolve();
      })
      .on('error', (err:any) => {
        console.error('Error reading CSV file', err);
        reject(err);
      });
  });
}

async function loadCountriesFromCSV() {
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const filePath = path.resolve(__dirname, 'countries.csv');

    return new Promise<void>((resolve, reject) => {
        const countryList: string[] = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row:any) => {
                if (row) {
                    countryList.push(row[Object.keys(row)[0]].split(',')[0]);
                }
            })
            .on('end', () => {
                countries = countryList; 
                resolve();
            })
            .on('error', (err:any) => {
            console.error('Error reading CSV file', err);
            reject(err);
            });
    });
}

export default function getSchools(app: Express) {
    app.post(
        "/obtainSchools",
        async (req, res) => {
            await loadSchoolsFromCSV();
            await loadCountriesFromCSV();
            res.send({
                'schools': schools,
                'countries': countries
            });
        }
    )
}
