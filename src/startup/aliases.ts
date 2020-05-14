import ma from 'module-alias'
import path from 'path'

const aliases = {
  "@config": "src/config",
  "@globals": "src/globals",
  "@models": "src/models",
  "@interfaces": "src/interfaces",
  "@structures": "src/structures",
  "@utils": "src/utils",
  "@commands": "src/commands"
}

const handler = (from, _, alias) => {
  if (from.split(path.sep).some(e => e === 'dist')) {
    return path.resolve(process.cwd(), 'dist', aliases[alias])
  } else {
    return path.resolve(process.cwd(), aliases[alias])
  }
}

for (const alias in aliases) {
  ma.addAlias(alias, handler)
}
