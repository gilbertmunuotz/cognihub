// *** Import Router & Controller Func *** //
import { Router } from "express";
import { AnalyzeInfo } from "../controllers/service";


// **** Functions **** //
//Initiate Express Router
const router = Router();


/* GET info  */
router.post('/analyze', AnalyzeInfo);


// **** Export default **** //
export default router;