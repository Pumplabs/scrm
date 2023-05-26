const npmEnv = process.env.npm_config_env
const args = Array.isArray(process.argv) ? process.argv : []
const isProd = args.some(ele => ele.includes('webpack.prod.js'))
module.exports = {
  process: {
    env: {
      IS_PRODUCTION_DEV: isProd && npmEnv === 'dev',
      NODE_ENV: isProd ? 'production': 'development'
    }
  }
}