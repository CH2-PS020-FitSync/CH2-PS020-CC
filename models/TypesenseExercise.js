module.exports = {
  name: 'exercises_1',
  enable_nested_fields: true,
  fields: [
    {
      name: 'title',
      type: 'string',
      sort: true,
    },
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'level',
      type: 'string',
    },
    {
      name: 'gender',
      type: 'string',
    },
    {
      name: 'bodyPart',
      type: 'string',
    },
    {
      name: 'desc',
      type: 'string',
    },
    {
      name: 'jpg',
      type: 'string',
    },
    {
      name: 'gif',
      type: 'string',
    },
    {
      name: 'duration.sec',
      type: 'string',
      optional: true,
    },
    {
      name: 'duration.rep',
      type: 'string',
      optional: true,
    },
    {
      name: 'duration.set',
      type: 'string',
      optional: true,
    },
    {
      name: 'duration.min',
      type: 'string',
      optional: true,
    },
    {
      name: 'duration.desc',
      type: 'string',
      optional: true,
    },
  ],
};
