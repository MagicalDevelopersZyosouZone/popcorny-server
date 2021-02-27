import Application from "koa";
import coBody from "co-body";

export interface JsonBodyContext<T>
{
    request: {
        body: T
    }
}

export async function jsonBody<T>(ctx: Application.ParameterizedContext<Application.DefaultContext, JsonBodyContext<T>>, next: Application.Next)
{
    if (!ctx.is("application/json"))
        ctx.throw(400);
    else
    {
        try
        {
            const body = await coBody.json(ctx);
            ctx.request.body = body;
        }
        catch
        {
            ctx.throw(400);
        }
        await next();
    }
}