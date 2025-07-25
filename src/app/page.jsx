"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Stethoscope,
  Pill,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Sample symptom database
const SYMPTOMS = [
  "Fever",
  "Headache",
  "Cough",
  "Sore throat",
  "Runny nose",
  "Fatigue",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Stomach pain",
  "Muscle aches",
  "Shortness of breath",
  "Chest pain",
  "Dizziness",
  "Rash",
  "Joint pain",
  "Loss of appetite",
  "Chills",
  "Sweating",
  "Congestion",
]

// Sample diagnosis database with symptoms and remedies
const DIAGNOSES = [
  {
    name: "Common Cold",
    symptoms: ["Runny nose", "Cough", "Sore throat", "Congestion", "Fatigue"],
    confidence: 0,
    description: "A viral infection of the upper respiratory tract",
    remedies: [
      "Get plenty of rest (7-9 hours of sleep)",
      "Stay hydrated with water, herbal teas, and warm broths",
      "Use a humidifier or breathe steam from hot shower",
      "Gargle with warm salt water for sore throat",
      "Consider over-the-counter pain relievers if needed",
    ],
    severity: "Mild",
    duration: "7-10 days",
    icon: "🤧",
  },
  {
    name: "Flu (Influenza)",
    symptoms: ["Fever", "Muscle aches", "Fatigue", "Headache", "Cough", "Chills"],
    confidence: 0,
    description: "A viral infection that affects the respiratory system",
    remedies: [
      "Rest and sleep as much as possible",
      "Drink plenty of fluids to prevent dehydration",
      "Take fever reducers like acetaminophen or ibuprofen",
      "Use a cool mist humidifier",
      "Eat light, nutritious foods when appetite returns",
    ],
    severity: "Moderate",
    duration: "1-2 weeks",
    icon: "🤒",
  },
  {
    name: "Food Poisoning",
    symptoms: ["Nausea", "Vomiting", "Diarrhea", "Stomach pain", "Fever", "Fatigue"],
    confidence: 0,
    description: "Illness caused by consuming contaminated food or water",
    remedies: [
      "Stay hydrated with clear fluids and electrolyte solutions",
      "Follow the BRAT diet (Bananas, Rice, Applesauce, Toast)",
      "Avoid dairy, caffeine, alcohol, and fatty foods",
      "Rest and avoid solid foods until vomiting stops",
      "Seek medical attention if symptoms persist over 3 days",
    ],
    severity: "Moderate",
    duration: "1-7 days",
    icon: "🤢",
  },
  {
    name: "Tension Headache",
    symptoms: ["Headache", "Muscle aches", "Fatigue", "Dizziness"],
    confidence: 0,
    description: "The most common type of headache, often stress-related",
    remedies: [
      "Apply a cold or warm compress to head or neck",
      "Practice relaxation techniques like deep breathing",
      "Get adequate sleep and maintain regular sleep schedule",
      "Stay hydrated and eat regular meals",
      "Consider over-the-counter pain relievers if needed",
    ],
    severity: "Mild to Moderate",
    duration: "30 minutes to several hours",
    icon: "🧠",
  },
  {
    name: "Allergic Reaction",
    symptoms: ["Rash", "Runny nose", "Congestion", "Shortness of breath", "Dizziness"],
    confidence: 0,
    description: "Body's immune response to an allergen",
    remedies: [
      "Identify and avoid the allergen trigger",
      "Take antihistamines as directed",
      "Apply cool compresses to affected skin areas",
      "Use fragrance-free moisturizers for skin irritation",
      "Seek immediate medical attention for severe reactions",
    ],
    severity: "Mild to Severe",
    duration: "Hours to days",
    icon: "🌸",
  },
]

export default function SymptomAnalyzer() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [analysis, setAnalysis] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [triedDiagnoses, setTriedDiagnoses] = useState([])
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (userData && isAuthenticated) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredSymptoms = SYMPTOMS.filter((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev) => {
      const newSymptoms = prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
      return newSymptoms
    })
  }

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setCurrentStep(2)

    // Simulate analysis with progress
    for (let i = 0; i <= 100; i += 10) {
      setAnalysisProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    const results = DIAGNOSES.map((diagnosis) => {
      const matchingSymptoms = diagnosis.symptoms.filter((symptom) => selectedSymptoms.includes(symptom))
      const confidence = (matchingSymptoms.length / diagnosis.symptoms.length) * 100

      return {
        ...diagnosis,
        confidence: Math.round(confidence),
        matchingSymptoms,
      }
    })
      .filter((diagnosis) => diagnosis.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence)

    setAnalysis(results)
    setShowResults(true)
    setIsAnalyzing(false)
    setCurrentStep(3)

    // After setting analysis results, add:
    if (user) {
      const sessionData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        symptoms: selectedSymptoms,
        results: results,
        completed: false,
        feedback: null,
      }

      const existingSessions = JSON.parse(localStorage.getItem(`sessions_${user.id}`) || "[]")
      existingSessions.push(sessionData)
      localStorage.setItem(`sessions_${user.id}`, JSON.stringify(existingSessions))
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Mild":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Moderate":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Severe":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const handleRemedyFeedback = (diagnosis, helped) => {
    if (!helped) {
      setTriedDiagnoses((prev) => [...prev, diagnosis.name])
      const alternatives = analysis.filter((d) => d.name !== diagnosis.name && !triedDiagnoses.includes(d.name))

      if (alternatives.length > 0) {
        setAnalysis(alternatives)
        setCurrentDiagnosis(null)
        setShowFeedback(false)
      } else {
        setAnalysis([])
        setShowResults(true)
      }
    } else {
      setCurrentDiagnosis({ ...diagnosis, helped: true })
      setShowFeedback(false)
    }
  }

  const tryDiagnosis = (diagnosis) => {
    setCurrentDiagnosis(diagnosis)
    setShowFeedback(true)
    setCurrentStep(4)
  }

  const resetAnalysis = () => {
    setTriedDiagnoses([])
    setCurrentDiagnosis(null)
    setShowFeedback(false)
    setSelectedSymptoms([])
    setAnalysis([])
    setShowResults(false)
    setCurrentStep(1)
  }

  const getStepColor = (step) => {
    if (step < currentStep) return "bg-green-500 text-white"
    if (step === currentStep) return "bg-blue-500 text-white"
    return "bg-gray-200 text-gray-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Add this header section right after the opening div */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 mb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Health Assistant
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Welcome, {user.firstName}!</span>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Animated Header */}
        <div className="text-center space-y-4 animate-in fade-in duration-1000">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Stethoscope className="h-10 w-10 text-blue-600 animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-yellow-500 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Health Assistant
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Get personalized health insights powered by AI. Select your symptoms for intelligent analysis and
            evidence-based remedy recommendations.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[
            { step: 1, label: "Symptoms", icon: Search },
            { step: 2, label: "Analysis", icon: Zap },
            { step: 3, label: "Results", icon: Info },
            { step: 4, label: "Treatment", icon: Heart },
          ].map(({ step, label, icon: Icon }, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${getStepColor(step)}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={`ml-2 font-medium ${step === currentStep ? "text-blue-600" : "text-gray-500"}`}>
                {label}
              </span>
              {index < 3 && <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />}
            </div>
          ))}
        </div>

        {/* Enhanced Disclaimer */}
        <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 animate-in slide-in-from-top duration-500">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Medical Disclaimer:</strong> This AI assistant provides general health information only. Always
            consult healthcare professionals for proper diagnosis and treatment.
          </AlertDescription>
        </Alert>

        {/* Enhanced Symptom Selection */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-in slide-in-from-bottom duration-700">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Search className="h-6 w-6" />
              Tell Us Your Symptoms
              {selectedSymptoms.length > 0 && (
                <Badge className="bg-white/20 text-white border-white/30">{selectedSymptoms.length} selected</Badge>
              )}
            </CardTitle>
            <CardDescription className="text-blue-100">
              Select all symptoms you're currently experiencing for accurate analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Enhanced Search */}
            <div className="space-y-3">
              <Label htmlFor="symptom-search" className="text-lg font-semibold text-gray-700">
                Search Symptoms
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="symptom-search"
                  placeholder="Type to search symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg border-2 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Selected Symptoms with Animation */}
            {selectedSymptoms.length > 0 && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <Label className="text-lg font-semibold text-gray-700">
                  Selected Symptoms ({selectedSymptoms.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom, index) => (
                    <Badge
                      key={symptom}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100 hover:text-red-800 transition-all duration-200 transform hover:scale-105 px-3 py-2 text-sm animate-in slide-in-from-left"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => handleSymptomToggle(symptom)}
                    >
                      {symptom} <XCircle className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Symptom Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSymptoms.map((symptom, index) => (
                <div
                  key={symptom}
                  className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md animate-in slide-in-from-bottom ${
                    selectedSymptoms.includes(symptom)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => handleSymptomToggle(symptom)}
                >
                  <Checkbox
                    id={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={() => handleSymptomToggle(symptom)}
                    className="data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor={symptom} className="text-sm font-medium cursor-pointer flex-1">
                    {symptom}
                  </Label>
                  {selectedSymptoms.includes(symptom) && (
                    <CheckCircle className="h-4 w-4 text-blue-500 animate-in zoom-in duration-200" />
                  )}
                </div>
              ))}
            </div>

            {/* Enhanced Analyze Button */}
            <div className="pt-4">
              {isAnalyzing ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-500 animate-pulse" />
                    <span className="text-lg font-medium text-blue-600">Analyzing your symptoms...</span>
                  </div>
                  <Progress value={analysisProgress} className="h-3" />
                  <p className="text-center text-sm text-gray-600">
                    Our AI is processing your symptoms and matching them with medical conditions
                  </p>
                </div>
              ) : (
                <Button
                  onClick={analyzeSymptoms}
                  disabled={selectedSymptoms.length === 0}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Analyze My Symptoms
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Results */}
        {showResults && analysis.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <Info className="h-8 w-8 text-blue-600" />
                Your Health Analysis
              </h2>
              <p className="text-gray-600">Based on your symptoms, here are the most likely conditions</p>
            </div>

            {!showFeedback &&
              !currentDiagnosis?.helped &&
              analysis.map((diagnosis, index) => (
                <Card
                  key={diagnosis.name}
                  className={`shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-in slide-in-from-left duration-500 hover:shadow-2xl transition-all ${
                    index === 0 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-blue-500"
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{diagnosis.icon}</span>
                          <div>
                            <CardTitle className="text-2xl text-gray-800">{diagnosis.name}</CardTitle>
                            <CardDescription className="text-lg text-gray-600 mt-1">
                              {diagnosis.description}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-3">
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="outline" className="text-lg px-4 py-2 font-bold border-2">
                            {diagnosis.confidence}% Match
                          </Badge>
                          <Badge className={`${getSeverityColor(diagnosis.severity)} border font-medium px-3 py-1`}>
                            {diagnosis.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Matching Symptoms */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Matching Symptoms:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {diagnosis.matchingSymptoms.map((symptom, idx) => (
                          <Badge
                            key={symptom}
                            variant="secondary"
                            className="bg-green-100 text-green-800 border-green-200 px-3 py-1 animate-in zoom-in"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            ✓ {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Duration */}
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <strong>Typical Duration:</strong>
                      <span className="text-blue-600 font-medium">{diagnosis.duration}</span>
                    </div>

                    <Separator className="my-4" />

                    {/* Remedies */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <Pill className="h-5 w-5 text-purple-500" />
                        Recommended Treatment Plan:
                      </h4>
                      <div className="grid gap-3">
                        {diagnosis.remedies.map((remedy, remedyIndex) => (
                          <div
                            key={remedyIndex}
                            className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 animate-in slide-in-from-right"
                            style={{ animationDelay: `${remedyIndex * 100}ms` }}
                          >
                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {remedyIndex + 1}
                            </span>
                            <span className="text-gray-700 font-medium">{remedy}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Enhanced Try Button */}
                    <Button
                      onClick={() => tryDiagnosis(diagnosis)}
                      className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Start This Treatment Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}

            {/* Enhanced Feedback Section */}
            {showFeedback && currentDiagnosis && (
              <Card className="shadow-2xl border-0 bg-gradient-to-r from-orange-50 to-yellow-50 animate-in zoom-in duration-500">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white animate-pulse" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-gray-800">How Are You Feeling?</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    You've been following the treatment plan for <strong>{currentDiagnosis.name}</strong>. Have the
                    remedies helped improve your symptoms?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleRemedyFeedback(currentDiagnosis, true)}
                      className="h-16 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <CheckCircle className="h-6 w-6 mr-2" />
                      Yes, I feel much better! 🎉
                    </Button>
                    <Button
                      onClick={() => handleRemedyFeedback(currentDiagnosis, false)}
                      variant="outline"
                      className="h-16 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
                    >
                      <XCircle className="h-6 w-6 mr-2" />
                      No, still not feeling well 😔
                    </Button>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Clock className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-blue-700">
                      Please wait at least a few hours after trying the remedies before providing feedback.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Enhanced Success Message */}
            {currentDiagnosis?.helped && (
              <Card className="shadow-2xl border-0 bg-gradient-to-r from-green-50 to-emerald-50 animate-in zoom-in duration-700">
                <CardContent className="text-center py-12 space-y-6">
                  <div className="flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center animate-bounce">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-green-800">Fantastic! You're on the mend! 🎉</h3>
                  <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                    The treatment plan for <strong>{currentDiagnosis.name}</strong> has been effective. Continue
                    following the recommendations and get plenty of rest.
                  </p>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    className="h-12 px-8 text-lg font-semibold border-2 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 bg-transparent"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Start New Health Analysis
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Enhanced No More Alternatives */}
            {showResults && analysis.length === 0 && triedDiagnoses.length > 0 && (
              <Card className="shadow-2xl border-0 bg-gradient-to-r from-red-50 to-orange-50 animate-in slide-in-from-bottom duration-700">
                <CardContent className="text-center py-12 space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-orange-400 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-10 w-10 text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-red-800">Time for Professional Care</h3>
                  <div className="space-y-4">
                    <p className="text-lg text-gray-700">
                      You've tried treatments for: <strong>{triedDiagnoses.join(", ")}</strong>
                    </p>
                    <p className="text-lg text-gray-700">
                      Since these haven't provided relief, we strongly recommend consulting with a healthcare provider
                      for proper diagnosis and treatment.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={resetAnalysis}
                      variant="outline"
                      className="h-12 px-6 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300 bg-transparent"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Start New Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {showResults && analysis.length === 0 && triedDiagnoses.length === 0 && (
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-in fade-in duration-500">
            <CardContent className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">No Matches Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No matching diagnoses found for the selected symptoms. Please consult with a healthcare professional for
                proper evaluation.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
