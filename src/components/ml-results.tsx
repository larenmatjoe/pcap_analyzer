"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, AlertTriangle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MlResultsProps {
  data: [number[], number][];
}

export default function MlResults({ data }: MlResultsProps) {
  // Calculate average score
  const averageScore =
    data.reduce((sum, [prediction, score]) => sum + score, 0) / data.length;
  const hasThreat = averageScore > 5;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Machine Learning Analysis
          </CardTitle>
          <CardDescription>
            Threat detection using machine learning models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert variant={hasThreat ? "destructive" : "default"}>
              {hasThreat ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {hasThreat
                  ? "Potential threats detected"
                  : "No significant threats detected"}
              </AlertTitle>
              <AlertDescription>
                {hasThreat
                  ? "The machine learning model has identified potential security threats in the PCAP file."
                  : "The machine learning model did not identify significant security threats in the PCAP file."}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Threat Score</span>
                <span className="text-sm font-medium">
                  {averageScore.toFixed(2)}/10
                </span>
              </div>
              <Progress value={averageScore * 10} className="h-2" />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Risk Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(([prediction, score], index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">
                      {JSON.stringify(prediction)}
                    </TableCell>
                    <TableCell>{score}/10</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            score > 7
                              ? "bg-red-500"
                              : score > 4
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <span>
                          {score > 7 ? "High" : score > 4 ? "Medium" : "Low"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
