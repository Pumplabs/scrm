package com.scrm.server.wx.cp.utils;

import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

@Slf4j
public class ExecUtils {

    public static void exec(String exec){

        Runtime runtime = Runtime.getRuntime();
        Process p = null;
        try {
            p = runtime.exec(exec);
            new RunThread(p.getInputStream(), "INFO").start();
            new RunThread(p.getErrorStream(), "INFO").start();

            int value = p.waitFor();
            log.info("exec [{}] result is [{}]", exec, value);

        } catch (IOException | InterruptedException e) {
            log.info("exec [{}] error, ", exec, e);
            throw new RuntimeException(e);
        }
    }


    @Slf4j
    static class RunThread extends Thread {

        InputStream is;

        String printType;

        RunThread(InputStream is, String printType) {

            this.is = is;

            this.printType = printType;

        }

        public void run() {

            try (
                    InputStreamReader isr = new InputStreamReader(is);
                    BufferedReader br = new BufferedReader(isr)
                    ){

                String line=null;
                while ( (line = br.readLine()) != null)
                    log.info("[{}] > [{}]", printType, line);
            } catch (IOException ioe) {
                log.error("[{}] > ", printType, ioe);
            }

        }

    }

}
