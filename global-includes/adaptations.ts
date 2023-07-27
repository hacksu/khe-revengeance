import { FieldRef } from "remult";
import { FieldOptions, Fields } from "remult";

type Validator = (entity: any, fieldRef: FieldRef<any, any>) => any;

export class VFields {
  static getTypeChecker(typeString: string) {
    return function (entity: any, field: FieldRef) {
      if (typeof field.value !== typeString) {
        throw field.metadata.key + " should be a " + typeString;
      }
    };
  }

  static getValidators(
    existing: Validator | Validator[] | undefined,
    typeString: string
  ): Validator[] {
    let validators = [this.getTypeChecker(typeString)];
    if (Array.isArray(existing)) {
      validators = validators.concat(existing);
    } else if (existing) {
      validators.push(existing);
    }
    return validators;
  }

  static nonEmptyString(options: FieldOptions = {}) {
    return Fields.string({
      ...options,
      validate: [
        ...this.getValidators(options.validate, "string"),
        (e, f) => f.value.length > 0,
      ],
    });
  }

  static string(options: FieldOptions = {}) {
    return Fields.string({
      ...options,
      validate: this.getValidators(options.validate, "string"),
    });
  }

  static boolean(options: FieldOptions = {}) {
    return Fields.boolean({
      ...options,
      validate: this.getValidators(options.validate, "boolean"),
    });
  }

  static number(options: FieldOptions = {}) {
    return Fields.number({
      ...options,
      validate: this.getValidators(options.validate, "number"),
    });
  }

  static int(options: FieldOptions = {}) {
    return Fields.number({
      ...options,
      validate: this.getValidators(options.validate, "number").concat([
        (entity, field) => {
          if (Math.round(field.value) != field.value) {
            throw field.metadata.key + " should be an integer";
          }
        },
      ]),
    });
  }
}
