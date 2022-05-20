
function main(...args: string[]): void {
  console.log("Hello world!")
  for (let i = 0; i < args.length; i++)
    console.log(`arg[${i}] = ${args[i]}`)
}

main(...process.argv.slice(2))
