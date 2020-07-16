import React from 'react';
import Story from './components/story/Story';
import FormFooter from './components/formFooter/FormFooter';
import Questions from './components/questions/Questions';
// import MainStoryTable from './components/mainStoryTable/MainStoryTable';


function App() {
  return (
    <div className="App">
      <Story />
      <Questions />
      <FormFooter />
      {/* <MainStoryTable /> */}
    </div>
  );
}

export default App;
