
import { useParams } from "react-router-dom";

export default () => {

    const {nom} = useParams()

    return (
        <>
        <h1>Mostra bolet {nom}</h1>
        </>
    )
}