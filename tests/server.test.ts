import createServer from "../src/server";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkxOTM4NjQyfQ.APczVDwpmsxHvLfAXgHIn4Sht6VHSpVum8DXKhP0wVg";
const currencies = [
  {
    id: 1,
    name: "AUD",
    rate: "290.49",
  },
  {
    id: 2,
    name: "AZN",
    rate: "263.01",
  },
  {
    id: 3,
    name: "AMD",
    rate: "11.56",
  },
  {
    id: 4,
    name: "BYN",
    rate: "177.04",
  },
  {
    id: 5,
    name: "BRL",
    rate: "91.12",
  },
  {
    id: 6,
    name: "HUF",
    rate: "12.73",
  },
  {
    id: 7,
    name: "HKD",
    rate: "57.04",
  },
  {
    id: 8,
    name: "GEL",
    rate: "172.26",
  },
  {
    id: 9,
    name: "DKK",
    rate: "65.68",
  },
  {
    id: 10,
    name: "AED",
    rate: "121.39",
  },
];

const findMock = jest.fn().mockReturnValue(currencies);
const findOneByMock = jest.fn().mockReturnValue(currencies[1]);

jest.mock("typeorm", () => {
  const originalModule = jest.requireActual("typeorm");

  return {
    __esModule: true,
    ...originalModule,
    DataSource: jest.fn().mockImplementation(() => ({
      getRepository: jest.fn().mockImplementation(() => ({
        find: findMock,
        findOneBy: findOneByMock,
      })),
      initialize: jest.fn(),
    })),
  };
});

describe("Server", () => {
  const server = createServer();

  beforeEach(async () => {
    await server.ready();
  });
  afterAll(() => server.close());

  test("GET /currencies returns list of currencies", (done) => {
    server.inject(
      {
        method: "GET",
        url: "/currencies?skip=2&take=2",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      (err, res) => {
        expect(res.statusCode).toBe(200);
        expect(findMock).toHaveBeenCalledWith({
          skip: "2",
          take: "2",
        });
        expect(JSON.parse(res.payload)[0]).toEqual(currencies[0]);
        done(err);
      }
    );
  });

  test("GET /currency returns currency", (done) => {
    server.inject(
      {
        method: "GET",
        url: "/currency/1",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      (err, res) => {
        expect(res.statusCode).toBe(200);
        expect(findOneByMock).toHaveBeenCalledWith({
          id: 1,
        });
        expect(JSON.parse(res.payload)).toEqual(currencies[1]);
        done(err);
      }
    );
  });
});
