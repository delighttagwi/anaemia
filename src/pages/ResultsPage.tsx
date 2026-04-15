import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "@/components/Layout";
import { getScanResults, getStatusColor, getRecommendation } from "@/lib/anemia";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export default function ResultsPage() {
  const results = getScanResults();
  const latest = results[0];

  const chartData = [...results].reverse().map((r) => ({
    date: new Date(r.date).toLocaleDateString(),
    hb: r.hb,
  }));

  const statusIcon = (s: string) => {
    switch (s) {
      case "Normal": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Mild": return <Info className="h-5 w-5 text-yellow-500" />;
      case "Moderate": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "Severe": return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 font-heading text-3xl font-bold text-foreground">Results Dashboard</h1>

        {!latest ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">No scan results yet. Go to the Scan page to perform your first analysis.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Current Result */}
            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl gradient-crimson p-8 text-center shadow-crimson-lg"
              >
                <p className="mb-2 text-sm font-medium text-primary-foreground/80">Estimated Hemoglobin</p>
                <p className="font-heading text-6xl font-extrabold text-primary-foreground">{latest.hb}</p>
                <p className="mt-1 text-sm text-primary-foreground/80">g/dL</p>
                <Badge className={`mt-4 ${getStatusColor(latest.status)}`}>{latest.status} Anemia</Badge>
              </motion.div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  {statusIcon(latest.status)}
                  <h3 className="font-heading text-lg font-semibold text-foreground">Recommendation</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{getRecommendation(latest.status)}</p>
              </div>
            </div>

            {/* Chart */}
            {chartData.length > 1 && (
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-heading text-lg font-semibold text-foreground">Hb Level History</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 91%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(0 0% 45%)" />
                    <YAxis domain={[4, 18]} tick={{ fontSize: 12 }} stroke="hsl(0 0% 45%)" />
                    <Tooltip />
                    <Line type="monotone" dataKey="hb" stroke="hsl(348, 83%, 47%)" strokeWidth={2} dot={{ fill: "hsl(348, 83%, 47%)" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* History Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Date</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Mode</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Hb (g/dL)</th>
                    <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-4 py-3 text-muted-foreground">{new Date(r.date).toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground">{r.mode}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{r.hb}</td>
                      <td className="px-4 py-3"><Badge className={getStatusColor(r.status)}>{r.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
