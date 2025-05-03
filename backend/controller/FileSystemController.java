package com.example.notepadx.controller;

import com.example.notepadx.model.File;
import com.example.notepadx.model.Folder;
import com.example.notepadx.service.FileSystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/filesystem")
@CrossOrigin(origins = "*")
public class FileSystemController {
    @Autowired
    private FileSystemService fileSystemService;

    @PostMapping("/file")
    public File createFile(@RequestBody Map<String, String> payload) {
        return fileSystemService.createFile(
                payload.get("name"),
                payload.get("parentId"),
                payload.getOrDefault("content", "")
        );
    }

    @PostMapping("/folder")
    public Folder createFolder(@RequestBody Map<String, String> payload) {
        return fileSystemService.createFolder(
                payload.get("name"),
                payload.get("parentId")
        );
    }

    @PutMapping("/file/{id}/rename")
    public ResponseEntity<?> renameFile(@PathVariable String id, @RequestBody Map<String, String> payload) {
        fileSystemService.renameFile(id, payload.get("name"));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/folder/{id}/rename")
    public ResponseEntity<?> renameFolder(@PathVariable String id, @RequestBody Map<String, String> payload) {
        fileSystemService.renameFolder(id, payload.get("name"));
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/file/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id) {
        fileSystemService.deleteFile(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/folder/{id}")
    public ResponseEntity<?> deleteFolder(@PathVariable String id) {
        fileSystemService.deleteFolder(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/file/{id}/content")
    public ResponseEntity<?> updateFileContent(@PathVariable String id, @RequestBody Map<String, String> payload) {
        fileSystemService.updateFileContent(id, payload.get("content"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/file/{id}")
    public File getFile(@PathVariable String id) {
        return fileSystemService.getFile(id);
    }

    @GetMapping("/folder/{id}")
    public Folder getFolder(@PathVariable String id) {
        return fileSystemService.getFolder(id);
    }

    @GetMapping("/file/{id}/path")
    public List<Map<String, Object>> getFilePath(@PathVariable String id) {
        return fileSystemService.getFilePath(id);
    }

    @GetMapping("/search")
    public List<File> searchFiles(@RequestParam String term) {
        return fileSystemService.searchFiles(term);
    }

    @GetMapping
    public Map<String, Object> getFileSystem() {
        return fileSystemService.getFileSystem();
    }
}
