// lib/corsMiddleware.ts
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: '*', // This will allow all origins
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, result: any) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);
}
