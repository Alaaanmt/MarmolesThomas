import { Router, Request, Response } from 'express';
import { colorGranito, colorMelamina, colorVanitory} from './colores'
import { trabajos, trabajosPorId } from './trabajos';
import { detallesGranito, detallesMelamina, detallesMarmol, detallesSilestone } from './detalles';
import { subirImagenDT } from './uploadImagesDT';

const router = Router()

router.get('/', (req: Request, res: Response) => {
    res.json({ 
        status: 'ok',
        message: 'La Api está funcionando'
    })
})

router.get('/nuestrostrabajos', trabajos)

router.get('/detallestrabajos/:id',  trabajosPorId)

router.get('/granitocolor', colorGranito)

router.get('/melaminacolor', colorMelamina)

router.get('/vanitorycolor', colorVanitory)

router.get('/granitodetalles', detallesGranito)

router.get('/marmoldetalles', detallesMarmol)

router.get('/melaminadetalles', detallesMelamina)

router.get('/silestonedetalles', detallesSilestone)

router.post('/uploadDetallesTrabajos', subirImagenDT)

export default router