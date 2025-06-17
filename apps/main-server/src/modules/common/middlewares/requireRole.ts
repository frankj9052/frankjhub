// import { NextFunction, Request, Response } from "express"
// import { UnauthorizedError } from "../errors/UnauthorizedError";

// /**
//  * 中间件：检查用户是否在某个组织中拥有指定角色
//  *
//  * @param requiredRoles 允许访问的角色代码数组
//  * @param options 可选项：指定组织 ID 限定范围
//  */
// export const requireRole = (requiredRoles: string[], options?: {orgName?: string}) => {
//     return(req: Request, res: Response, next: NextFunction) => {
//         const user = req.currentUser;
//         if(!user) {
//             throw new UnauthorizedError('User not authenticated');
//         }

//         const { orgRoles } = user;

//         const matched = orgRoles.some(orgRole => {
//             const isRole = options?.orgId ? orgRole.orgId === options.
//         })
//         const role = req.currentUser?.orgRoles;

//     }
// }
