# next-query 🔎

<p>
<a href="https://www.npmjs.com/next-query"><img src="https://img.shields.io/npm/v/next-query.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/next-query"><img src="https://img.shields.io/npm/l/next-query.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/next-query"><img src="https://img.shields.io/npm/dm/next-query.svg" alt="NPM Downloads" /></a>
</p>

## Blurb

A hook for Next.js which can parse and return a query-string object, even on load.

## Installation

```shell
npm install next-query
```
```shell
yarn add next-query
```

## Usage

### Basic

```typescript
import useQuery from 'next-query';

function Page() {
  const { id } = useQuery(); // Returns => { id: string | string[] };
  
  ...
}
```

### Typed

```typescript
import useQuery from 'next-query';

function Page() {
  const { id } = useQuery<{ id: string }>(); // Return Type => { id: string };
  
  ...
}
```

### Parsed

```typescript
import useQuery from 'next-query';

function Page() {
  const { id } = useQuery({ id: Number }); // Return Type => { id: number };
  
  ...
}
```

See Supported Parse Types for more

### Arrays

```typescript
import useQuery from 'next-query';

function Page() {
  const { ids } = useQuery({ ids: [Number] }); // Return Type => { ids: number[] };
  
  ...
}
```

### Complex

```typescript
import useQuery from 'next-query';

function Page() {
  const { ids, selected } = useQuery({ id: Number, selected: Boolean }); // Return Type => { id: number, selected: boolean };
  
  ...
}
```

## API

### Supported Parse Types

```typescript
String | Boolean | Number
```
