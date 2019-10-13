[Home](/) &gt; [fast-check](../fast-check.md) &gt; [anything](anything.md)

## anything() function

For any type of values

You may use [sample()](sample.md) to preview the values that will be generated

<b>Signature:</b>

```typescript
declare function anything(): Arbitrary<unknown>;
```
<b>Returns:</b>

`Arbitrary<unknown>`

#### Example

\`\`\`<!-- -->null, undefined, 42, 6.5, 'Hello', {<!-- -->} or {<!-- -->k: \[{<!-- -->}<!-- -->, 1, 2\]<!-- -->}<!-- -->\`\`\`

