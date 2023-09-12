# 用户输入到文件并读取

## 基于stream

```cpp
#include <stdio.h>

int main()
{
    // 打开要写入的文件
    FILE *fp = fopen("file.txt", "w");
    if (fp == NULL) {
        printf("Failed to open file\n");
        return 1;
    }

    // 从命令行中读取输入
    char buffer[1024];
    printf("Enter text to write to file: ");
    fgets(buffer, sizeof(buffer), stdin);

    // 将读取到的输入写入文件
    fprintf(fp, "%s", buffer);

    // 关闭文件
    fclose(fp);

    printf("Text written to file successfully\n");

    return 0;
}
```



```c
#include <stdio.h>

int main()
{
    // 打开要读取的文件
    FILE *fp = fopen("file.txt", "r");
    if (fp == NULL) {
        printf("Failed to open file\n");
        return 1;
    }

    // 读取文件中的数据
    char buffer[1024];
    int n = fread(buffer, sizeof(char), sizeof(buffer), fp);
    if (n > 0) {
        printf("Read %d bytes from file\n", n);
        printf("File content: %s", buffer);
    } else {
        printf("Failed to read file\n");
    }

    // 关闭文件
    fclose(fp);

    return 0;
}
```



## 基于文件标识符

```c
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

int main()
{
    int fd = open("file.txt", O_RDWR);
    if (fd == -1) {
        printf("Failed to open file\n");
        return 1;
    }

    // 读取文件中的数据
    char buffer[1024];
    int n = read(fd, buffer, sizeof(buffer));
    if (n > 0) {
        printf("Read %d bytes from file\n", n);
        printf("File content: %s", buffer);
    } else {
        printf("Failed to read file\n");
    }

    // 将数据写入文件
    char data[] = "Hello, world!";
    int m = write(fd, data, sizeof(data));
    if (m > 0) {
        printf("Wrote %d bytes to file\n", m);
    } else {
        printf("Failed to write file\n");
    }
    
    // 从用户输入中读取数据
    char buffer[1024];
    printf("Enter text to write to file: ");
    fgets(buffer, sizeof(buffer), stdin);
    // 将数据写入文件
    int n = write(fd, buffer, sizeof(buffer));
    if (n > 0) {
        printf("Wrote %d bytes to file\n", n);
    } else {
        printf("Failed to write file\n");
    }

    // 定位文件指针
    lseek(fd, 0, SEEK_END);
    long size = ftell(fd);
    printf("File size: %ld bytes\n", size);

    // 关闭文件
    close(fd);

    return 0;
}
```



# 按行写入和输出

```c
#include <stdio.h>
#include <stdlib.h>

int main()
{
    FILE *fp;
    char *line = NULL;
    size_t len = 0;
    ssize_t nread;

    // 打开文件
    fp = fopen("file.txt", "r");
    if (fp == NULL) {
        printf("Failed to open file\n");
        return 1;
    }

    // 逐行读取文件并输出
    while ((nread = getline(&line, &len, fp)) != -1) {
        printf("%s", line);
    }

    // 关闭文件
    fclose(fp);
    if (line) {
        free(line);
    }

    return 0;
}
```



```c
#include <stdio.h>
#include <stdlib.h>

int main()
{
    FILE *fp;
    char *line = NULL;
    size_t len = 0;
    ssize_t nread;

    // 打开文件
    fp = fopen("file.txt", "w");
    if (fp == NULL) {
        printf("Failed to open file\n");
        return 1;
    }

    // 从用户输入中读取数据，并按行写入文件
    printf("Enter text to write to file (type 'quit' to exit):\n");
    while (1) {
        nread = getline(&line, &len, stdin);
        if (nread == -1 || strncmp(line, "quit", 4) == 0) {
            break;
        }
        fprintf(fp, "%s", line);
    }

    // 关闭文件
    fclose(fp);
    if (line) {
        free(line);
    }

    return 0;
}
```

