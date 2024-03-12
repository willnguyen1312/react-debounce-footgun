import { http, HttpResponse } from "msw";

const timeouts: number[] = [250, 500, 1000, NaN];

const numbers: number[] = [1, 2, 3, 4];

export const handlers = [
  http.get("/api/number", async () => {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const number = numbers[randomIndex];
    const timeout = timeouts[randomIndex];

    const hasError = Number.isNaN(timeout);
    await new Promise((resolve) =>
      setTimeout(resolve, hasError ? 500 : timeout),
    );

    return HttpResponse.json(
      {
        data: hasError
          ? undefined
          : {
              number,
            },
      },
      {
        status: hasError ? 500 : 200,
      },
    );
  }),
];
