const express = require("express");
const cors = require("cors");
const { uuid,isUuid } = require("uuidv4");

const app = express();
app.use(express.json());

app.use(cors());

const repositories = [];

function validationRepositoriesId(request,response,next){
  const { id } = request.params;

if(!isUuid(id)){
  return response.status(400).json({errsor:'Invalid repositorie Id'});
  }

  return next();
}


app.use('/repositories/:id',validationRepositoriesId);

app.get('/repositories', (request,response) =>{
  return response.json(repositories);
});

app.post('/repositories', (request,response) =>{
  const { title , url , techs } = request.body;
  const project = {
    id:uuid(),
    title,
    url,
    techs,
    likes:0,
  }
  repositories.push(project);
  return response.json(project); 
});


app.put('/repositories/:id', (request,response) =>{
  const { id } = request.params;
  const { title , url , techs } = request.body;

  const repositoriIndex = repositories.findIndex(repositorie => repositorie.id = id);
  const { likes } = repositories[repositoriIndex];

  if(repositoriIndex < 0){
    return response.status(400).json({error:'Repositorie not found.'})
  }

  const repositorie = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoriIndex] = repositorie;
  return response.json(repositorie);
});


app.delete('/repositories/:id', (request,response) =>{
  const { id } = request.params;
  const repositorie = repositories.findIndex(repositorie => repositorie.id = id);

  if(repositorie < 0 ){
    return response.status(400).json({error:'Repositorie not found.'})
  }

  repositories.splice(repositorie,1);
  return response.status(204).send();
});

app.post('/repositories/:id/likes',(request,response) =>{
  const { id } = request.params;

  const repositorie = repositories.findIndex(repositorie => repositorie.id = id);

  if(repositorie < 0 ){
    return response.status(400).json({error:'Repositorie not found.'})
  }

  repositories[repositorie].likes +=1;

  return response.json(repositories[repositorie]);
})

app.listen(3333)