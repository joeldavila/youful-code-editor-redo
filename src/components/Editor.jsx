import React, { useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/mdn-like.css';
import 'codemirror/theme/the-matrix.css';
import 'codemirror/theme/night.css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/mode/python/python';
// import pyodide from 'pyodide';
// import { PythonShell } from 'react-codemirror2';
// import { Pyodide } from '@pyodide/pyodide';
import { Controlled as ControlledEditorComponent } from 'react-codemirror2';


const Editor = ({ language, value, setEditorState }) => {
    const [theme, setTheme] = useState("dracula")

    const handleChange = (editor, data, value) => {
        setEditorState(value);
    }

    const themeArray = ['dracula', 'material', 'mdn-like', 'the-matrix', 'night']

    // // Initialize Pyodide
    // const [pyodide, setPyodide] = useState(null);

    // useEffect(() => {
    //     const initPyodide = async () => {
    //         const pyodideInstance = await Pyodide.load({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/' });
    //         setPyodide(pyodideInstance);
    //     };

    //     initPyodide();
    // }, []);
    
    return (
        <div className="editor-container">
            <div style={{marginBottom: "10px"}}>
                <label htmlFor="themes">Choose a theme: </label>
                <select name="theme" onChange={(el) => {
                    setTheme(el.target.value)
                }}>
                    {
                        themeArray.map( (theme, i) => (
                            <option key={i} value={theme}>{theme}</option>
                        ))
                    }
                </select>
            </div>
            {
                // language === 'python' && pyodide ? (
                //     <PythonShell
                //     pyodide={pyodide}
                //     code={value}
                //     onStdout={(output) => console.log(output)} // You can handle Python output here
                //     onStderr={(error) => console.error(error)} // You can handle Python errors here
                //     className="code-mirror-wrapper"
                //     options={{
                //         theme: theme,
                //     }}
                //     />
                // ) : (
            
                <ControlledEditorComponent
                    onBeforeChange={handleChange}
                    value= {value}
                    className="code-mirror-wrapper"
                    options={{
                        lineWrapping:      true,
                        lint:              true,
                        mode:          language,
                        lineNumbers:       true,

                        theme:            theme,

                        autoCloseTags:     true,
                        autoCloseBrackets: true,
                    }}
                />
                // )
                }
        </div>
    )
}
export default Editor
