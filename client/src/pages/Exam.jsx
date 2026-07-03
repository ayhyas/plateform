import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, CircleAlert, CircleCheck, Clock } from 'lucide-react';
import api, { getStudentToken, setStudentToken } from '../services/api.js';
import Header from '../components/Header.jsx';
import Loader from '../components/Loader.jsx';

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function Exam() {
  const navigate = useNavigate();
  const settings = JSON.parse(localStorage.getItem('exam_settings') || 'null');
  const studentInfo = JSON.parse(localStorage.getItem('student_info') || 'null');

  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  function finishAndRedirect(reason) {
    setStudentToken(null);
    localStorage.removeItem('student_info');
    navigate('/exam/termine', { state: { reason } });
  }

  const fetchCurrent = useCallback(async () => {
    try {
      const res = await api.get('/student/exam/current');
      setQuestion(res.data.question);
      setIndex(res.data.index);
      setTotal(res.data.total);
      setRemaining(res.data.remainingSeconds);
      setSelected(null);
      setError(null);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'TIME_UP') {
        finishAndRedirect('time_up');
        return;
      }
      if (code === 'ALREADY_COMPLETED') {
        finishAndRedirect('already');
        return;
      }
      if (err.response?.status === 401) {
        setStudentToken(null);
        navigate('/');
        return;
      }
      setError("Impossible de charger la question. Verifiez votre connexion.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!getStudentToken()) {
      navigate('/');
      return;
    }
    fetchCurrent();
  }, [fetchCurrent, navigate]);

  useEffect(() => {
    if (loading) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          finishAndRedirect('time_up');
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, index]);

  async function handleNext() {
    if (selected === null || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/student/exam/answer', { choiceIndex: selected });
      setJustSubmitted(true);

      setTimeout(async () => {
        setJustSubmitted(false);
        if (res.data.completed) {
          finishAndRedirect('submitted');
          return;
        }
        await fetchCurrent();
        setSubmitting(false);
      }, 550);
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === 'TIME_UP' || code === 'ALREADY_COMPLETED') {
        finishAndRedirect(code === 'TIME_UP' ? 'time_up' : 'already');
        return;
      }
      setError("Impossible d'enregistrer votre reponse. Reessayez.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <Header settings={settings} />
        <div className="page-content">
          <Loader dark />
        </div>
      </div>
    );
  }

  const progressPct = total > 0 ? Math.round((index / total) * 100) : 0;

  return (
    <div className="page">
      <Header settings={settings} />
      <div className="page-content">
        <div className="container">
          <div className="exam-topbar">
            <div>
              <div className="student-name">
                {studentInfo ? `${studentInfo.prenom} ${studentInfo.nom}` : ''}
              </div>
              <div className="question-index">
                Question {index + 1} / {total}
              </div>
            </div>
            <div className={`timer ${remaining < 60 ? 'timer-warning' : ''}`}>
              <Clock size={15} />
              {formatTime(remaining)}
            </div>
          </div>

          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="card">
            {error && (
              <div className="alert alert-error">
                <CircleAlert size={18} />
                <span>{error}</span>
              </div>
            )}
            {justSubmitted && (
              <div className="alert alert-success">
                <CircleCheck size={18} />
                <span>Reponse enregistree</span>
              </div>
            )}

            {question && (
              <>
                <div className="question-text">{question.text}</div>
                <div className="choices-list">
                  {question.choices.map((choice, idx) => (
                    <div
                      key={idx}
                      className={`choice-option ${selected === idx ? 'selected' : ''}`}
                      onClick={() => !submitting && setSelected(idx)}
                    >
                      <span className="choice-marker">{String.fromCharCode(65 + idx)}</span>
                      <span className="choice-label">{choice}</span>
                      {selected === idx && <Check size={18} className="choice-check" />}
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-block"
                  disabled={selected === null || submitting}
                  onClick={handleNext}
                >
                  {submitting ? (
                    <span className="spinner" />
                  ) : index + 1 === total ? (
                    <>
                      Terminer
                      <Check size={17} />
                    </>
                  ) : (
                    <>
                      Suivant
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
