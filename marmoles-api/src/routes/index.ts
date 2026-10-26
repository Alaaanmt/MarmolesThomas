import { Router, Request, Response } from 'express';
import { colorGranito, colorMelamina, colorVanitory} from './colores'
import { trabajos, trabajosPorId } from './trabajos';
import { detallesGranito, detallesMelamina, detallesMarmol, detallesSilestone } from './detalles';
import { subirImagenDT } from './uploadImagesDT';
import { actualizarDetalleTrabajo, eliminarDetalleTrabajo } from './detallesTrabajosCrud';
import { actualizarMaterial, crearMaterial, eliminarMaterial } from './materiales';
import { requireAdminApiKey } from '../middleware/adminAuth';

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

router.post('/granitodetalles', crearMaterial('granite'))
router.put('/granitodetalles/:id', requireAdminApiKey, actualizarMaterial('granite'))
router.delete('/granitodetalles/:id', requireAdminApiKey, eliminarMaterial('granite'))

router.post('/marmoldetalles', requireAdminApiKey, crearMaterial('marble'))
router.put('/marmoldetalles/:id', requireAdminApiKey, actualizarMaterial('marble'))
router.delete('/marmoldetalles/:id', requireAdminApiKey, eliminarMaterial('marble'))

router.post('/silestonedetalles', requireAdminApiKey, crearMaterial('quartz'))
router.put('/silestonedetalles/:id', requireAdminApiKey, actualizarMaterial('quartz'))
router.delete('/silestonedetalles/:id', requireAdminApiKey, eliminarMaterial('quartz'))

router.post('/melaminadetalles', requireAdminApiKey, crearMaterial('melamine'))
router.put('/melaminadetalles/:id', requireAdminApiKey, actualizarMaterial('melamine'))
router.delete('/melaminadetalles/:id', requireAdminApiKey, eliminarMaterial('melamine'))

router.post('/uploadDetallesTrabajos', requireAdminApiKey, subirImagenDT)
router.put('/detallestrabajos/:id', requireAdminApiKey, actualizarDetalleTrabajo)
router.delete('/detallestrabajos/:id', requireAdminApiKey, eliminarDetalleTrabajo)

export default router