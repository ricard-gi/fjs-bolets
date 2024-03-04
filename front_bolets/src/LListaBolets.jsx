
import { useState, useEffect } from 'react';


const API_URL = 'http://localhost:3000/api';


export default () => {

    const [bolets, setBolets] = useState([])

    useEffect(() => {

        fetch(API_URL + '/bolets')
            .then(resp => resp.json())
            .then(data => setBolets(data))

    }, [])


    return (<>
        <h1>Llista de bolets</h1>


        <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table
                            className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                            <thead
                                className="border-b border-neutral-200 font-medium dark:border-white/10">
                                <tr>
                                    <th scope="col" className="px-6 py-4">#</th>
                                    <th scope="col" className="px-6 py-4">Nom</th>
                                    <th scope="col" className="px-6 py-4">Tipus</th>
                                    <th scope="col" className="px-6 py-4">Foto</th>
                                </tr>
                            </thead>
                            <tbody>

                                {bolets.map(bolet => 
                                (<tr key={bolet.id} className="border-b border-neutral-200 dark:border-white/10">
                                    <td className="whitespace-nowrap px-6 py-4 font-medium">{bolet.id}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{bolet.nom}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{bolet.tipus}</td>
                                    <td className="whitespace-nowrap px-6 py-4"><img width="150px" src={`/img/${bolet.foto}`} alt={bolet.nom} /></td>
                                </tr>)
                                )}
                               
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    </>)



}