export function generateRecommendation(
  trustScore: number,
  data: any
) {
  const recommendations: string[] = [];

  if (data.company)
    recommendations.push(
      "Government organization identified."
    );

  if (data.website?.includes(".gov"))
    recommendations.push(
      "Official government website verified."
    );

  if (data.website?.startsWith("https"))
    recommendations.push(
      "Secure HTTPS connection detected."
    );

  if (data.salary)
    recommendations.push(
      "Salary structure appears realistic."
    );

  if (data.applicationFee)
    recommendations.push(
      "Official application fee mentioned."
    );

  if (trustScore >= 90)
    recommendations.push(
      "Very low scam probability."
    );

  else if (trustScore >= 70)
    recommendations.push(
      "Review notification before applying."
    );

  else
    recommendations.push(
      "High scam probability detected."
    );

  return recommendations;
}