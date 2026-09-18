// import type { FullTagDescription } from "@reduxjs/toolkit/query";

// export const providesList = <
//   T extends string,
//   Item extends { _id?: string; id?: string },
// >(
//   type: T,
//   items: Item[] = [],
// ): FullTagDescription<T>[] => [
//   { type, id: "LIST" } as FullTagDescription<T>,

//   ...items
//     .map((item) => item._id ?? item.id)
//     .filter(Boolean)
//     .map((id) => ({ type, id }) as FullTagDescription<T>),
// ];