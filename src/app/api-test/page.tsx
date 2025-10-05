"use client";

import React, { useState } from "react";
import { Button } from "@/components/atoms/Button";
import { authService } from "@/services/authService";
import { archiveService } from "@/services/archiveService";
import { routeService } from "@/services/routeService";
import { useToast } from "@/components/ToastProvider";

export default function ApiTestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    result: unknown;
    error?: unknown;
    timestamp: string;
  }>>([]);
  const { showToast } = useToast();

  const addResult = (test: string, result: unknown, error?: unknown) => {
    setTestResults(prev => [...prev, {
      test,
      result,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testAuthService = async () => {
    setIsLoading(true);
    try {
      // 토큰 검증 테스트
      const isValid = await authService.validateToken();
      addResult("Auth - Token Validation", { isValid });
      showToast("인증 서비스 테스트 완료", "success");
      } catch (err) {
        addResult("Auth - Token Validation", null, err);
      showToast("인증 서비스 테스트 실패", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const testArchiveService = async () => {
    setIsLoading(true);
    try {
      // 아카이브 조회 테스트
      const archives = await archiveService.getArchives();
      addResult("Archive - Get Archives", { count: archives.length, archives });
      showToast("아카이브 서비스 테스트 완료", "success");
      } catch (err) {
        addResult("Archive - Get Archives", null, err);
      showToast("아카이브 서비스 테스트 실패", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const testRouteService = async () => {
    setIsLoading(true);
    try {
      // 경로 서비스 테스트 (간단한 좌표로)
      const testRequest = {
        origin: { x: 128.5914, y: 37.4138 }, // 강릉
        destination: { x: 128.5556, y: 37.4500 }, // 속초
        waypoints: [{ x: 128.7294, y: 37.2986 }] // 춘천
      };
      
      const result = await routeService.getDirections(testRequest);
      addResult("Route - Get Directions", { 
        hasRoutes: result.routes.length > 0,
        totalDistance: result.meta.totalDistance,
        totalDuration: result.meta.totalDuration
      });
      showToast("경로 서비스 테스트 완료", "success");
      } catch (err) {
        addResult("Route - Get Directions", null, err);
      showToast("경로 서비스 테스트 실패", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const testAllServices = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      await testAuthService();
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      
      await testArchiveService();
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      
      await testRouteService();
      
      showToast("모든 API 테스트 완료!", "success");
      } catch {
      showToast("API 테스트 중 오류 발생", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="api-test-page">
      <div className="api-test-header">
        <h1>백엔드 API 연결 테스트</h1>
        <p>백엔드 서버와의 연결 상태를 확인합니다.</p>
      </div>

      <div className="api-test-controls">
        <Button 
          variant="primary" 
          onClick={testAllServices}
          disabled={isLoading}
        >
          {isLoading ? "테스트 중..." : "전체 테스트 실행"}
        </Button>
        
        <div className="individual-tests">
          <Button 
            variant="outline" 
            onClick={testAuthService}
            disabled={isLoading}
          >
            인증 서비스 테스트
          </Button>
          
          <Button 
            variant="outline" 
            onClick={testArchiveService}
            disabled={isLoading}
          >
            아카이브 서비스 테스트
          </Button>
          
          <Button 
            variant="outline" 
            onClick={testRouteService}
            disabled={isLoading}
          >
            경로 서비스 테스트
          </Button>
        </div>

        <Button 
          variant="ghost" 
          onClick={clearResults}
          disabled={isLoading}
        >
          결과 초기화
        </Button>
      </div>

      <div className="api-test-results">
        <h2>테스트 결과</h2>
        {testResults.length === 0 ? (
          <p className="no-results">아직 테스트를 실행하지 않았습니다.</p>
        ) : (
          <div className="results-list">
            {testResults.map((result, index) => (
              <div key={index} className={`result-item ${result.error ? 'error' : 'success'}`}>
                <div className="result-header">
                  <span className="test-name">{result.test}</span>
                  <span className="test-time">{result.timestamp}</span>
                </div>
                <div className="result-content">
                  {result.error ? (
                    <div className="error-content">
                      <strong>오류:</strong>
                      <pre>{JSON.stringify(result.error, null, 2)}</pre>
                    </div>
                  ) : (
                    <div className="success-content">
                      <strong>결과:</strong>
                      <pre>{JSON.stringify(result.result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
