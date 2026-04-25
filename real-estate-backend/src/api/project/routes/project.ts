export default {
  routes: [
    {
      method: 'GET',
      path: '/projects',
      handler: 'project.find',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/projects/:id',
      handler: 'project.findOne',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/projects',
      handler: 'project.create',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'PUT',
      path: '/projects/:id',
      handler: 'project.update',
      config: {
        policies: [],
        auth: false
      }
    },
    {
      method: 'DELETE',
      path: '/projects/:id',
      handler: 'project.delete',
      config: {
        policies: [],
        auth: false
      }
    }
  ]
};