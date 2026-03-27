import minimist from "minimist"

export const isProduction = () => {
  const options = minimist(process.argv.slice(2))
  return Boolean(options.production)
}