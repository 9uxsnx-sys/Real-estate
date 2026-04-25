export default {
  routes: [
    {
      method: 'GET',
      path: '/properties',
      handler: 'property.find',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/properties/:id',
      handler: 'property.findOne',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/properties',
      handler: 'property.create',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'PUT',
      path: '/properties/:id',
      handler: 'property.update',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'DELETE',
      path: '/properties/:id',
      handler: 'property.delete',
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};