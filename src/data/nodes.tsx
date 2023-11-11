export const nodes =  [
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: -250, y: 0 },
    },
  
    {
      id: '2',
      // you can also pass a React component as a label
      data: { label: <div>Default Node</div> },
      position: { x: 0, y: 0 },
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 250, y: 0 },
    },
  ];
  