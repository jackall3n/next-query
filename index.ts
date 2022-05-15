import { useRouter } from "next/router";
import { useMemo } from "react";
import querystring from 'query-string';

type BaseTypes = typeof Boolean | typeof Number | typeof String
type Types = BaseTypes | BaseTypes[]

// export function useQuery(types: Record<string, Types>): string | string[];
// export function useQuery(key: string): string | string[];
// export function useQuery<Keys extends string, Arrays extends Keys = never>(...keys: string[]): { [P in Keys]: Arrays[P] extends never ? string : string[] };
// export function useQuery(...keys: string[]) {
//   const router = useRouter()
//
//   return useMemo(() => {
//     const [, query] = router.asPath.split('?');
//
//     const parsed = querystring.parse(query);
//
//     if (!keys.length) {
//       return parsed
//     }
//
//     if (keys.length === 1) {
//       return parsed[keys[0]]
//     }
//
//     return keys.reduce((query, key) => ({
//       ...query,
//       [key]: parsed[key]
//     }), {})
//   }, [router.asPath, keys]);
// }

type IsString<T> = T extends typeof String ? true : T extends string ? true : false;
type IsBoolean<T> = T extends typeof Boolean ? true : false;
type IsNumber<T> = T extends typeof Number ? true : false;

type ParseType<T> =
  IsString<T> extends true ? string :
    IsBoolean<T> extends true ? boolean :
      IsNumber<T> extends true ? number : (string | string[])

type Query<T> = {
  [K in keyof T]: ParseType<T[K]>
}

function useQuery<T extends Record<string, any>>(types?: T): Query<T> {
  const router = useRouter();

  const serialized = serializeTypes(types ?? {});

  return useMemo(() => {
    const deserialized = deserializeTypes(serialized);

    const [, query] = router.asPath.split('?');

    const parsed = querystring.parse(query, {
      arrayFormat: "comma"
    }) as any;

    const entries = Object.entries(deserialized)

    if (!entries.length) {
      return parsed;
    }

    return entries.reduce((query, [key, type]) => {
      const value = parsed[key] as string | string[];

      const result = (() => {
        if (!Array.isArray(type)) {
          return type(value)
        }

        if (Array.isArray(value) && Array.isArray(type)) {
          return value.map(v => type[0](v))
        }

        return value
      })()

      return ({
        ...query,
        [key]: result
      })

    }, {})
  }, [router.asPath, serialized]);
}

function serializeTypes(types: Record<string, Types>) {
  const serialized = Object.entries(types).reduce((serialized, [key, type]) => {
    const typeConstructor = Array.isArray(type) ? type[0] : type;

    const typeString = (() => {
      switch (typeConstructor) {
        case Number:
          return 'Number';
        case String:
          return 'String';
        case Boolean:
          return 'Boolean';
      }

      return 'Unknown'
    })();

    return {
      ...serialized,
      [key]: Array.isArray(type) ? `[]${typeString}` : typeString
    }
  }, {});

  return JSON.stringify(serialized);
}

function deserializeTypes(serialized: string): Record<string, Types> {
  const json = JSON.parse(serialized) as Record<string, string>;

  const deserialized = Object.entries(json).reduce((deserialized, [key, type]) => {
    const isArray = type.startsWith('[]');
    const typeString = isArray ? type.substring(2) : type;

    const typeConstructor = (() => {
      switch (typeString) {
        case 'Number':
          return Number;
        case 'String':
          return String;
        case 'Boolean':
          return Boolean;
      }

      return undefined
    })();

    return {
      ...deserialized,
      [key]: isArray ? [typeConstructor] : typeConstructor
    }
  }, {});

  return deserialized;
}

export default useQuery
