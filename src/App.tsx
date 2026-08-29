import { useState, useEffect } from 'react';
import type { Screen, FormData, CalculationResult, SavedEstimate, AppSettings, User, ColorTheme } from './types';
import { calculateBudget } from './utils/calculator';
import {
  getSavedEstimates, saveEstimate, deleteEstimate, clearAllEstimates,
  getSettings, saveSettings, DEFAULT_SETTINGS,
} from './utils/storage';
import { getCurrentUser, signOut } from './utils/auth';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import InputScreen from './screens/InputScreen';
import ResultScreen from './screens/ResultScreen';
import SavedEstimatesScreen from './screens/SavedEstimatesScreen';
import SettingsScreen from './screens/SettingsScreen';
import Navigation from './components/Navigation';

const COLOR_THEME_VARS: Record<ColorTheme, { primary: string; primaryLight: string; accent: string }> = {
  crimson: { primary: '#8B1A2B', primaryLight: '#B02238', accent: '#C8920A' },
  saffron: { primary: '#C2410C', primaryLight: '#EA580C', accent: '#D4A017' },
  emerald: { primary: '#065F46', primaryLight: '#047857', accent: '#D4A017' },
  royal:   { primary: '#1E3A8A', primaryLight: '#1D4ED8', accent: '#C8920A' },
};

function applyColorTheme(theme: ColorTheme) {
  const vars = COLOR_THEME_VARS[theme];
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', vars.primary);
  root.style.setProperty('--theme-primary-light', vars.primaryLight);
  root.style.setProperty('--theme-accent', vars.accent);
}

function resolveTheme(setting: AppSettings['theme']): boolean {
  if (setting === 'dark') return true;
  if (setting === 'light') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function buildDefaultForm(settings: AppSettings): FormData {
  return {
    guests: 150,
    style: settings.defaultStyle,
    location: 'kolkata',
    days: 2,
    season: settings.defaultSeason,
    ceremonies: settings.defaultCeremonies,
    additionalRequirements: '',
  };
}

export default function App() {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [screen, setScreen] = useState<Screen>('home');
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());
  const [formData, setFormData] = useState<FormData>(() => buildDefaultForm(getSettings()));
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>(() => getSavedEstimates());

  useEffect(() => {
    const apply = () => document.documentElement.classList.toggle('dark', resolveTheme(settings.theme));
    apply();
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [settings.theme]);

  useEffect(() => { applyColorTheme(settings.colorTheme); }, [settings.colorTheme]);

  function handleLogin(loggedInUser: User) {
    setUser(loggedInUser);
  }

  function handleSignOut() {
    signOut();
    setUser(null);
    setScreen('home');
    setResult(null);
  }

  function handleCalculate(data: FormData) {
    setFormData(data);
    setResult(calculateBudget(data, settings));
    setScreen('result');
  }

  function handleSaveEstimate(estimate: SavedEstimate) {
    saveEstimate(estimate);
    setSavedEstimates(getSavedEstimates());
  }

  function handleDeleteEstimate(id: string) {
    deleteEstimate(id);
    setSavedEstimates(getSavedEstimates());
  }

  function handleViewSaved(estimate: SavedEstimate) {
    setResult(estimate);
    setScreen('result');
  }

  function handleRecalculateSaved(estimate: SavedEstimate) {
    setFormData(estimate.formData);
    setScreen('input');
  }

  function handleUpdateSettings(newSettings: AppSettings) {
    setSettings(newSettings);
    saveSettings(newSettings);
  }

  function handleClearData() {
    clearAllEstimates();
    setSavedEstimates([]);
  }

  const isResultSaved = result
    ? savedEstimates.some((e) => e.calculatedAt === result.calculatedAt)
    : false;

  // Gate: show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#FDF8F0', color: '#2C1810' }}>
      <Navigation
        current={screen}
        savedCount={savedEstimates.length}
        user={user}
        onChange={setScreen}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 overflow-y-auto">
        {screen === 'home' && (
          <HomeScreen
            onStart={() => setScreen('input')}
            onViewSaved={() => setScreen('saved')}
            savedCount={savedEstimates.length}
            user={user}
          />
        )}
        {screen === 'input' && (
          <InputScreen
            initialData={formData}
            settings={settings}
            onCalculate={handleCalculate}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'result' && result && (
          <ResultScreen
            result={result}
            onEdit={() => setScreen('input')}
            onRecalculate={() => { setFormData(result.formData); setScreen('input'); }}
            onSave={handleSaveEstimate}
            isSaved={isResultSaved}
          />
        )}
        {screen === 'saved' && (
          <SavedEstimatesScreen
            estimates={savedEstimates}
            onView={handleViewSaved}
            onDelete={handleDeleteEstimate}
            onRecalculate={handleRecalculateSaved}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'settings' && (
          <SettingsScreen
            settings={settings}
            user={user}
            onUpdate={handleUpdateSettings}
            onClearData={handleClearData}
            onSignOut={handleSignOut}
            onBack={() => setScreen('home')}
          />
        )}
      </main>
    </div>
  );
}
