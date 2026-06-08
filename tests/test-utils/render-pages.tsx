import { render } from "@testing-library/react";
import type { ReactElement } from "react";

export async function renderAsyncPage(page: Promise<ReactElement>) {
  return render(await page);
}
