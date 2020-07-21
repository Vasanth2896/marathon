import React from 'react';
import { Route } from 'react-router-dom'
import Story from './components/story/Story';
import FormFooter from './components/formFooter/FormFooter';
import Questions from './components/questions/Questions';
import MainStoryTable from './components/mainStoryTable/MainStoryTable';


function App() {
  return (

    <div className="App">
      <Route path={'/storyform'}>
        <Story />
        <Questions />
        <FormFooter />
      </Route>
      <Route exact path={'/'} >
        <MainStoryTable />
      </Route >
    </div>
  );
}

export default App;
