import { http, HttpResponse } from 'msw';

/*export const handlers = [
  http.get('https://localhost:3002/owners', () => {
    return HttpResponse.json([
      { id: 1, firstName: 'Ana', lastName: 'García', email: 'ana@test.com' },
      { id: 2, firstName: 'Luis', lastName: 'López', email: 'luis@test.com' },
    ]);
  }),
];
*/

export const handlers = [
  http.get('/api/owners', () => {
    return HttpResponse.json([
      { id: 1, firstName: 'Ana', lastName: 'García', email: 'ana@test.com' },
      { id: 2, firstName: 'Luis', lastName: 'López', email: 'luis@test.com' },
    ]);
  }),
  http.get('/api/owners/:id', (req) => {
    const { id } = req.params;
    if (id === '1') {
      return HttpResponse.json({ id: 1, firstName: 'Ana', lastName: 'García', email: 'ana@test.com' });
    }
    return HttpResponse.json({ error: 'Owner not found' }, { status: 404 });
  }),
];  