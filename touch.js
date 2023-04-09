  const fs = require('fs');
  const path = require('path');
  const absPath = path.resolve(__dirname, './src/comps/triangle.jsx');
  const leafPath = path.resolve(__dirname, './src/comps/triangle_1_1_2_1_2_2_1.jsx')
console.log('changeRoot:', Date.now())  ;
  fs.appendFileSync(absPath, `
      console.log('root hmr');
      console.log('root:', Date.now());
    `)

// setTimeout(() => {
//   console.log('changeLeaf', Date.now())  ;
//   fs.appendFileSync(leafPath, `
//       console.log('leaf hmr');
//       console.log('leaf:', Date.now());
//     `)
// },2000)