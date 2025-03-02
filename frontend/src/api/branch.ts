export async function getBranchByBranchNo(branchNo: string) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/branches/branch/${branchNo}`);
  const json = await response.json();

  return { response, json };
}

export async function getAllBranches() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/branches`);
  const json = await response.json();

  return { response, json };
}
