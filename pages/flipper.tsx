import { useMemo } from 'react'
import { Container } from 'react-bootstrap'
import { initAPI } from '../api/ApiHelper'
import FlipperComponent from '../components/Flipper/Flipper'
import Search from '../components/Search/Search'
import { getCacheControlHeader } from '../utils/CacheUtils'
import { parseFlipAuction } from '../utils/Parser/APIResponseParser'
import { handleSettingsImport } from '../utils/SettingsUtils'
import { getHeadElement } from '../utils/SSRUtils'

interface Props {
    flips?: any
}

function Flipper(props: Props) {
    let flips = useMemo(() => {
        try {
            return JSON.parse(props.flips).map(flip => parseFlipAuction(flip))
        } catch (e) {
            console.log('ERROR: Error parsing preFlips')
            console.log(props.flips)
            console.log('------------------------\n')
            return []
        }
    }, [])

    function onDrop(e) {
        e.preventDefault()
        var output = '' //placeholder for text output
        let reader = new FileReader()
        let file = e.dataTransfer.items[0].getAsFile()
        if (file) {
            reader.onload = function (e) {
                output = e.target!.result!.toString()
                handleSettingsImport(output)
                //handleSettingsImport(output)
            } //end onload()
            reader.readAsText(file)
        }
        return true
    }

    function onDragOver(e) {
        e.preventDefault()
    }

    return (
        <div className="page" onDragOver={onDragOver} onDrop={onDrop}>
            {getHeadElement(undefined, 'Free auction house item flipper for Hypixel Skyblock', undefined, ['flipper'])}
            <Container>
                <Search />
                <h2>Item Flipper (WIP)</h2>
                <hr />
                <FlipperComponent flips={flips.map(parseFlipAuction)} />
            </Container>
        </div>
    )
}

export const getServerSideProps = async ({ res }) => {
    res.setHeader('Cache-Control', getCacheControlHeader())

    let api = initAPI(true)
    let flips = []
    try {
        flips = await api.getPreloadFlips()
    } catch (e) {
        console.log('ERROR: Error receiving preFlips')
        console.log('------------------------\n')
    }

    return {
        props: {
            flips: flips
        }
    }
}

export default Flipper
