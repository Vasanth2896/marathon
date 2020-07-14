import React from 'react';
// import './App.css';
import Story from './components/story/Story';
import FormFooter from './components/formFooter/FormFooter';
import Questions from './components/questions/Questions';


function App() {
  return (
    <div className="App">
      <Story />
      <Questions />
      <FormFooter />
    </div>
  );
}

export default App;
