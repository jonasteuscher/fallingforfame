import { render } from "@testing-library/react";
import type { ReactElement } from "react";

import { AudioProvider } from "@/components/audio";

export async function renderAsyncPage(page: Promise<ReactElement>) {
  return render(<AudioProvider>{await page}</AudioProvider>);
}
