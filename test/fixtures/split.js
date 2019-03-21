var BN = require('bn.js')

module.exports = [{
  'description': '1 to 3',
  'feeRate': new BN('10'),
  'inputs': [
    new BN('18000')
  ],
  'outputs': [{},
    {},
    {}
  ],
  'expected': {
    'inputs': [{
      'value': new BN('18000')
    }],
    'outputs': [{
      'value': new BN('5133')
    },
    {
      'value': new BN('5133')
    },
    {
      'value': new BN('5133')
    }
    ],
    'fee': new BN('2601')
  }
},
{
  'description': '5 to 2',
  'feeRate': new BN('10'),
  'inputs': [
    new BN('10000'),
    new BN('10000'),
    new BN('10000'),
    new BN('10000'),
    new BN('10000')
  ],
  'outputs': [{},
    {}
  ],
  'expected': {
    'inputs': [{
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    }
    ],
    'outputs': [{
      'value': new BN('20910')
    },
    {
      'value': new BN('20910')
    }
    ],
    'fee': new BN('8180')
  }
},
{
  'description': '3 to 1',
  'feeRate': new BN('10'),
  'inputs': [
    new BN('10000'),
    new BN('10000'),
    new BN('10000')
  ],
  'outputs': [{}],
  'expected': {
    'inputs': [{
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    }
    ],
    'outputs': [{
      'value': new BN('25120')
    }],
    'fee': new BN('4880')
  }
},
{
  'description': '3 to 3 (1 output pre-defined)',
  'feeRate': new BN('10'),
  'inputs': [
    new BN('10000'),
    new BN('10000'),
    new BN('10000')
  ],
  'outputs': [{
    'address': 'foobar',
    'value': new BN('12000')
  },
  {
    'address': 'fizzbuzz'
  },
  {}
  ],
  'expected': {
    'inputs': [{
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    },
    {
      'value': new BN('10000')
    }
    ],
    'outputs': [{
      'address': 'foobar',
      'value': new BN('12000')
    },
    {
      'address': 'fizzbuzz',
      'value': new BN('6220')
    },
    {
      'value': new BN('6220')
    }
    ],
    'fee': new BN('5560')
  }
},
{
  'description': '2 to 0 (no result)',
  'feeRate': new BN('10'),
  'inputs': [
    new BN('10000'),
    new BN('10000')
  ],
  'outputs': [],
  'expected': {
    'fee': new BN('3060')
  }
},
{
  'description': '0 to 2 (no result)',
  'feeRate': new BN('10'),
  'inputs': [],
  'outputs': [{},
    {}
  ],
  'expected': {
    'fee': new BN('780')
  }
},
{
  'description': '1 to 2, output is dust (no result)',
  'feeRate': new BN('10'),
  'inputs': [
    new BN('2000')
  ],
  'outputs': [{}],
  'expected': {
    'fee': new BN('1920')
  }
},
{
  'description': '2 outputs, some with missing value (NaN)',
  'feeRate': new BN('11'),
  'inputs': [
    new BN('20000')
  ],
  'outputs': [{
    'value': new BN('4000')
  },
  {}
  ],
  'expected': {
    'inputs': [{
      'value': new BN('20000')
    }],
    'outputs': [{
      'value': new BN('4000')
    },
    {
      'value': new BN('13514')
    }
    ],
    'fee': new BN('2486')
  }
},

// TODO
{
  'description': '2 outputs, some with float values (NaN)',
  'feeRate': new BN('10'),
  'inputs': [
    new BN('20000')
  ],
  'outputs': [{
    'value': 4000.5
  },
  {}
  ],
  'expected': {
    'fee': new BN('2260')
  }
},

{
  'description': '2 outputs, string values (NaN)',
  'feeRate': new BN('11'),
  'inputs': [
    new BN('20000')
  ],
  'outputs': [{
    'value': '100'
  },
  {
    'value': '204'
  }
  ],
  'expected': {
    'fee': new BN('2486')
  }
},
{
  'description': 'input with float values (NaN)',
  'feeRate': new BN('10'),
  'inputs': [
    20000.5
  ],
  'outputs': [{},
    {}
  ],
  'expected': {
    'fee': new BN('2260')
  }
},
{
  'description': 'inputs and outputs, bad feeRate (NaN)',
  'feeRate': '1',
  'inputs': [
    new BN('20000')
  ],
  'outputs': [{}],
  'expected': {}
},
{
  'description': 'inputs and outputs, bad feeRate (NaN)',
  'feeRate': 1.5,
  'inputs': [
    new BN('20000')
  ],
  'outputs': [{}],
  'expected': {}
}
]
