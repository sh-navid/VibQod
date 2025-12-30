package main

import (
	"bufio"
	"fmt"
	"log"
	"os/exec"
	"sync"
)

func runCommand(command string, args []string, dir string, prefix string, wg *sync.WaitGroup) {
	defer wg.Done()

	cmd := exec.Command(command, args...)
	cmd.Dir = dir

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Fatalf("%s: create stdout pipe: %v", prefix, err)
		return
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		log.Fatalf("%s: create stderr pipe: %v", prefix, err)
		return
	}

	stdoutScanner := bufio.NewScanner(stdout)
	stderrScanner := bufio.NewScanner(stderr)

	done := make(chan error, 2) // buffered channel to prevent goroutine leak

	go func() {
		for stdoutScanner.Scan() {
			fmt.Printf("%s [STDOUT]: %s\n", prefix, stdoutScanner.Text())
		}
		done <- stdoutScanner.Err()
	}()

	go func() {
		for stderrScanner.Scan() {
			fmt.Printf("%s [STDERR]: %s\n", prefix, stderrScanner.Text())
		}
		done <- stderrScanner.Err()
	}()

	if err := cmd.Start(); err != nil {
		log.Fatalf("%s: start command: %v", prefix, err)
		return
	}

	// Wait for the command to finish *and* the output scanners to complete
	err = cmd.Wait()
	if err != nil {
		fmt.Printf("%s: command finished with error: %v\n", prefix, err)
	} else {
		fmt.Printf("%s: command finished successfully\n", prefix)
	}

	// Ensure we wait for the stdout and stderr scanners to complete.
	for i := 0; i < 2; i++ {
		if err := <-done; err != nil && err != nil {
			log.Printf("%s: error reading stdout/stderr: %v", prefix, err)
		}
	}
}

func main() {
	var wg sync.WaitGroup

	// Backend
	wg.Add(1)
	go runCommand("dotnet", []string{"run"}, "../Backend", "[BACKEND]", &wg)

	// Frontend
	wg.Add(1)
	go runCommand("npm", []string{"run", "dev"}, "../Frontend", "[FRONTEND]", &wg) // Assuming 'dev' script defined in Frontend's package.json

	// App (Desktop)
	wg.Add(1)
	go runCommand("npm", []string{"run", "start"}, "../Desktop", "[APP]", &wg) // Assuming 'start' script defined in the Desktop's package.json

	wg.Wait()
	fmt.Println("All processes finished.")
}
