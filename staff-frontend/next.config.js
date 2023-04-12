export default {
  // they say this feature is experimental, but come on, it's been here since 2021
  experimental: { externalDir: true },
  modularizeImports: {
    "@ant-design/icons": {
      transform: "@ant-design/icons/lib/icons/{{member}}",
      preventFullImport: true,
    },
    antd: {
      transform: "antd/lib/{{lowerCase (kebabCase member)}}",
      preventFullImport: true,
    },
  },
};
