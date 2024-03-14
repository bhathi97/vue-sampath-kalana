const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
}),

module.exports = {
  devServer: {
    port: 3000, // Change this to the desired port number
  },
};
