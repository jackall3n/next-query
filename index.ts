import { useRouter } from "next/router";
import { useMemo } from "react";
import { Config, deserializeConfig, parse, Parsed, serializeConfig } from 'query-parsed';

function useQuery<T extends Config>(config?: T): Parsed<T> {
  const router = useRouter();

  const serialized = serializeConfig(config ?? {});

  return useMemo(() => {
    const deserialized = deserializeConfig(serialized);

    const [, query] = router.asPath.split('?');

    return parse(query, config, { arrayFormat: "comma" });
  }, [router.asPath, serialized]);
}

export default useQuery
