import React, {useEffect, useState} from 'react';
import './App.css';
import Button from './components/Button';
import Editor from './components/Editor';


function App() {
    const [openedEditor, setOpenedEditor] = useState('html');

    const [html, setHtml] = useState('');
    const [python, setPython] = useState(''); // Added Python
    const [css, setCss] = useState('');
    const [js, setJs] = useState('');
    const [srcDoc, setSrcDoc] = useState(` `);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setSrcDoc(
                `
          <html>
            <body>${html}</body>
            <style>${css}</style>
            <script>
                ${js} 
                ${python}
            </script>
          </html>
        `
            )
        }, 250);
        return () => {
            clearTimeout(timeOut)
        }
    }, [html, python, css, js])

    const onTabClick = (editorName) => {
        setOpenedEditor(editorName);
    };

    return (
        <div className="App">
            <p>Welcome to the editor!</p>
            <div className="tab-button-container">
                <Button title="HTML" onClick={() => {
                    onTabClick('html')
                }}/>
                <Button title="Python" onClick={() => {
                    onTabClick('python')
                }}/>
                <Button title="CSS" onClick={() => {
                    onTabClick('css')
                }}/>
                <Button title="JavaScript" onClick={() => {
                    onTabClick('js')
                }}/>
            </div>

            <div className="editor-container">
                {
                    openedEditor === 'html' ? (
                        <><p>The HTML editor is open</p>
                        <Editor
                            language="xml"
                            value={html}
                            setEditorState={setHtml}
                        /></>
                    ) : openedEditor === 'python' ? (
                        <><p>The Python editor is open!</p>
                        <Editor
                          language="python"
                          value={python}
                          setEditorState={setPython}
                        /> </>
                      ) : openedEditor === 'css' ? (
                        <><p>The CSS editor is open!</p>
                        <Editor
                            language="css"
                            value={css}
                            setEditorState={setCss}
                        /></>
                    ) : (
                        <><p>The JavaScript editor is open</p>
                        <Editor
                            language="javascript"
                            value={js}
                            setEditorState={setJs}
                        /></>
                    )
                }
            </div>

                <div>
                    <iframe
                        srcDoc={srcDoc}
                        title="output"
                        sandbox="allow-scripts"
                        frameBorder="1"
                        width="100%"
                        height="100%"
                    />
                </div>


        </div>
    );
}
export default App;