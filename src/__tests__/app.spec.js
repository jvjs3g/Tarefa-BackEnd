const request = require('supertest');
const app = require('../app');
const { isUuid } = require('uuidv4');

describe("Projects",() => {
  it('should be able to create a new repository', async () =>{
    const response = await request(app)
    .post("/repositories")
    .send({
      url: "https://github.com/jvjs3g",
      title: "Umbriel",
      techs: ["Node", "Express", "TypeScript"]
    });

    expect(isUuid(response.body.id)).toBe(true);


    expect(response.body).toMatchObject({
      url: "https://github.com/jvjs3g",
      title: "Umbriel",
      techs: ["Node", "Express", "TypeScript"],
      likes: 0
      })
    });
   
  it('should be able to list the projects',async () =>{
    const repository = await request(app)
    .post('/repositories')
    .send({
      url: "https://github.com/jvjs3g",
      title: "Umbriel",
      techs: ["Node", "Express", "TypeScript"]
    }); 

    const response = await request(app).get('/repositories');


    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: repository.body.id,
          url: "https://github.com/jvjs3g",
          title: "Umbriel",
          techs: ["Node", "Express", "TypeScript"],
          likes: 0
        }
      ])
    );
  });

  it("should be able to update repository", async () => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/jvjs3g",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"]
      });

    const response = await request(app)
      .put(`/repositories/${repository.body.id}`)
      .send({
        url: "https://github.com/Rocketseat/teste",
        title: "Unform",
        techs: ["React", "ReactNative", "TypeScript", "HTML","CSS"]
      });

    expect(isUuid(response.body.id)).toBe(true);

    expect(response.body).toMatchObject({
      url: "https://github.com/Rocketseat/teste",
      title: "Unform",
      techs: ["React", "ReactNative", "TypeScript", "HTML","CSS"]
    });
  });


  it('should not be able to update a repository that does not exist' , async () => {
    await request(app)
    .put('/repositories/123')
    .expect(400);
  });

  it('should not be able to update repository likes manually',async () => {
    const repository = await request(app)
    .post('/repositories')
    .send({
      url: "https://github.com/jvjs3g",
      title: "Umbriel",
      techs: ["Java", "ReactNative", "TypeScript", "HTML"]
    });

    const response = await request(app)
    .put(`/repositories/${repository.body.id}`)
    .send({
      likes:10
    });

    expect(response.body).toMatchObject({
      likes:0
    });
  })

  it("should be able to delete the repository", async () => {
    const repository = await request(app)
      .post("/repositories")
      .send({
        url: "https://github.com/jvjs3g",
        title: "Umbriel",
        techs: ["Node", "Express", "TypeScript"]
      });

    const response = await request(app)
      .delete(`/repositories/${repository.body.id}`)
      .expect(204);

    const project = await request(app)
    .get('/repositories');

    const exit = project.body.find(r => r.id === response.body.id);
    expect(exit).toBe(undefined)
   
  });

  it('should not be able to delete a repository that does not exist',async () => {
    await request(app)
    .delete('/repositories/123')
    .expect(400);
  })

});