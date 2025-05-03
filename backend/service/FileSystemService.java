package com.example.notepadx.service;

import com.example.notepadx.model.File;
import com.example.notepadx.model.Folder;
import com.example.notepadx.repository.FileRepository;
import com.example.notepadx.repository.FolderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FileSystemService {
    @Autowired
    private FileRepository fileRepository;
    @Autowired
    private FolderRepository folderRepository;

    public File createFile(String name, String parentId, String content) {
        File file = new File();
        file.setId(UUID.randomUUID().toString());
        file.setName(name);
        file.setContent(content);
        file.setParentId(parentId);
        return fileRepository.save(file);
    }

    public Folder createFolder(String name, String parentId) {
        Folder folder = new Folder();
        folder.setId(UUID.randomUUID().toString());
        folder.setName(name);
        folder.setParentId(parentId);
        return folderRepository.save(folder);
    }

    public void renameFile(String id, String newName) {
        fileRepository.findById(id).ifPresent(file -> {
            file.setName(newName);
            fileRepository.save(file);
        });
    }

    public void renameFolder(String id, String newName) {
        folderRepository.findById(id).ifPresent(folder -> {
            folder.setName(newName);
            folderRepository.save(folder);
        });
    }

    public void deleteFile(String id) {
        fileRepository.deleteById(id);
    }

    public void deleteFolder(String id) {
        // Get all child folder IDs recursively
        List<String> folderIds = getAllChildFolderIds(id);
        folderIds.add(id);
        // Delete all files in these folders
        fileRepository.findAll().stream()
                .filter(file -> folderIds.contains(file.getParentId()) || id.equals(file.getParentId()))
                .forEach(file -> fileRepository.deleteById(file.getId()));
        // Delete folders
        folderIds.forEach(folderRepository::deleteById);
    }

    private List<String> getAllChildFolderIds(String folderId) {
        List<String> result = new ArrayList<>();
        List<Folder> directChildren = folderRepository.findByParentId(folderId);
        for (Folder folder : directChildren) {
            result.add(folder.getId());
            result.addAll(getAllChildFolderIds(folder.getId()));
        }
        return result;
    }

    public void updateFileContent(String id, String content) {
        fileRepository.findById(id).ifPresent(file -> {
            file.setContent(content);
            fileRepository.save(file);
        });
    }

    public File getFile(String id) {
        return fileRepository.findById(id).orElse(null);
    }

    public Folder getFolder(String id) {
        return folderRepository.findById(id).orElse(null);
    }

    public List<Map<String, Object>> getFilePath(String fileId) {
        List<Map<String, Object>> path = new ArrayList<>();
        File file = getFile(fileId);
        if (file == null) return path;

        path.add(Map.of("id", file.getId(), "name", file.getName()));
        String currentParentId = file.getParentId();

        while (currentParentId != null) {
            Folder folder = getFolder(currentParentId);
            if (folder == null) break;
            path.add(0, Map.of("id", folder.getId(), "name", folder.getName()));
            currentParentId = folder.getParentId();
        }
        return path;
    }

    public List<File> searchFiles(String term) {
        return fileRepository.findByNameContainingIgnoreCase(term);
    }

    public Map<String, Object> getFileSystem() {
        Map<String, Object> fileSystem = new HashMap<>();
        fileSystem.put("files", fileRepository.findAll());
        fileSystem.put("folders", folderRepository.findAll());
        return fileSystem;
    }
}