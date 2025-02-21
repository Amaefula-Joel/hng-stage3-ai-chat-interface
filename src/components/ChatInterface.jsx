import { useState, useRef } from "react";

import Chat from "./Chat";
import ErrorAlert from "./ErrorAlert";

function ChatInterface() {
    const [outputs, setOutputs] = useState(['Output goes here... ']);
    const [error, setError] = useState("");
    const inputElement = useRef();

    const handleOutput = () => {
        const inputText = inputElement.current;
        // setOutput(inputtext.value);
        setOutputs((previousState) => [...previousState, inputText.value]);

        inputText.value = '';
        inputText.focus();
    }

    return (
        // container body of the interface
        <div className="min-h-screen bg-gray-100 sm:py-20 py-10 px-2 flex justify-center items-center">
            {/* for errors */}
            {error && <ErrorAlert error={error} onClose={() => setError("")}/>}
                
                {/* to test errors */}
            {/* <button onClick={ () => {setError('dhab fdiahbf aodfb ')}} className="px-4 py-2 bg-black text-[13px] text-white rounded-lg cursor-pointer">Summarize</button> */}

            {/* interface starts */}
            <div className="max-w-2xl w-full rounded-lg bg-gray-200 shadow-lg shadow-gray-400">

                {/* chat header */}
                <div className="chat-header text-center bg-black text-white px-2 py-3">
                    <h2>Ai text interface</h2>
                </div>

                {/* chat output */}
                <div className="chat-output p-3 mb-20">

                    {outputs.map((output, index) => <Chat key={index} output={output} />)}

                </div>

                <div className="flex items-end gap-3 p-2">
                    <textarea name="input" ref={inputElement} className="grow-1 resize-none whitespace-normal border-2 border-gray-400 bg-gray-100 rounded-lg h-32 px-3 py-1 text-nowrap">

                    </textarea>

                    <button
                        onClick={handleOutput}
                        className="grow-0 bg-black text-white h-11 w-11 cursor-pointer rounded-lg"><i className="fa fa-send"></i></button>
                </div>
            </div>
        </div>
    )
}

export default ChatInterface;