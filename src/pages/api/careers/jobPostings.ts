import { NextApiRequest, NextApiResponse } from 'next';
import { getOpenJobPostings } from '@/services/careers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const jobPostings = await getOpenJobPostings();
      res.status(200).json(jobPostings);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
